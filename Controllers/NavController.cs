using ConsoleMatycom.Models;
using ConsoleMatycom.Models.DynamicPages;
using ConsoleMatycom.Models.HomePages;
using ConsoleMatycom.Models.Navigation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Newtonsoft.Json;
using NuGet.Protocol;
using System.IO;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using static NuGet.Packaging.PackagingConstants;

namespace ConsoleMatycom.Controllers
{
    public class NavController : Controller
    {

        private IConfiguration _configuration;

        public NavController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        /// <summary>
        /// Récupère la liste complète des éléments de navigation depuis un fichier JSON stocké sur le disque.
        /// </summary>
        /// <returns>
        /// Un objet JSON contenant la liste des éléments de navigation si l'opération réussit, ou un message d'erreur en cas d'échec.
        /// </returns>
        [HttpGet]
        public IActionResult GetList()
        {
            try
            {
                // Récupération des chemins depuis la configuration
                string navigationPath = _configuration.GetSection("VirtualsDirectories").GetSection("Navigation").Value;
                string jsonFile = _configuration.GetSection("Navigation").GetSection("JsonFileList").Value;
                string path = Path.Combine(navigationPath, jsonFile);
                string navPathPrefixe = _configuration.GetSection("Navigation").GetSection("JsonFileItemPrefixe").Value;
                string navPathSuffixe = _configuration.GetSection("Navigation").GetSection("JsonFileItemSuffixe").Value;

                // Vérifie si le fichier existe
                if (!System.IO.File.Exists(path))
                {
                    // Navigation list
                    NavigationVM newNav = new NavigationVM();
                    List<NavigationVM> newList = new List<NavigationVM>();
                    newList.Add(newNav);

                    using FileStream fs = System.IO.File.Create(path);
                    byte[] baseContent = new UTF8Encoding(true).GetBytes(JsonConvert.SerializeObject(newList));
                    fs.Write(baseContent, 0, baseContent.Length);

                    // New nav
                    string newNavPath = Path.Combine(navigationPath, navPathPrefixe + newNav.Id + navPathSuffixe);
                    NavigationItemVM newItem = new NavigationItemVM();
                    newNav.Items.Add(newItem);

                    using FileStream fs2 = System.IO.File.Create(newNavPath);
                    byte[] newNavContent = new UTF8Encoding(true).GetBytes(JsonConvert.SerializeObject(newNav));
                    fs2.Write(newNavContent, 0, newNavContent.Length);
                }

                // Lecture du fichier JSON
                using StreamReader reader = new StreamReader(path);
                string json = reader.ReadToEnd();

                // Paramètres de désérialisation
                JsonSerializerSettings settings = new JsonSerializerSettings()
                {
                    TypeNameHandling = TypeNameHandling.All,
                    MetadataPropertyHandling = MetadataPropertyHandling.ReadAhead
                };

                // Désérialisation du JSON en liste d'objets NavigationListItemVM
                List<NavigationListItemVM>? list = JsonConvert.DeserializeObject<List<NavigationListItemVM>>(json);

                if (list != null)
                {
                    // Retourne la liste des éléments de navigation
                    return Json(new
                    {
                        IsValid = true,
                        Items = list
                    });
                }

                throw new Exception("La liste est null");

            }
            catch (Exception ex)
            {
                // En cas d'erreur, retourne un JSON avec le message d'erreur
                return Json(new
                {
                    IsValid = false,
                    ErrorMessage = ex.Message
                });
            }
        }

        /// <summary>
        /// Récupère un élément de navigation spécifique identifié par son ID, depuis un fichier JSON stocké sur le disque.
        /// </summary>
        /// <param name="id">Identifiant de l'élément de navigation à récupérer.</param>
        /// <returns>
        /// Un objet JSON contenant l'élément de navigation demandé si l'opération réussit, ou un message d'erreur en cas d'échec.
        /// </returns>
        [HttpGet]
        public IActionResult GetNavigation(string id)
        {
            try
            {
                // Récupération des chemins et paramètres de nommage des fichiers depuis la configuration
                string navigationPath = _configuration.GetSection("VirtualsDirectories").GetSection("Navigation").Value;
                string jsonFilePrefixe = _configuration.GetSection("Navigation").GetSection("JsonFileItemPrefixe").Value;
                string jsonFileSuffixe = _configuration.GetSection("Navigation").GetSection("JsonFileItemSuffixe").Value;
                string path = Path.Combine(navigationPath, jsonFilePrefixe + id + jsonFileSuffixe);

                // Vérifie si le fichier existe
                if (System.IO.File.Exists(path))
                {
                    // Lecture du fichier JSON
                    using StreamReader reader = new StreamReader(path);
                    string json = reader.ReadToEnd();

                    // Paramètres de désérialisation
                    JsonSerializerSettings settings = new JsonSerializerSettings()
                    {
                        TypeNameHandling = TypeNameHandling.All,
                        MetadataPropertyHandling = MetadataPropertyHandling.ReadAhead
                    };

                    // Désérialisation du JSON en un objet NavigationVM
                    NavigationVM? item = JsonConvert.DeserializeObject<NavigationVM>(json);

                    if (item != null)
                    {
                        // Retourne l'élément de navigation
                        return Json(new
                        {
                            IsValid = true,
                            Item = item
                        });
                    }

                    throw new Exception("L'item est null");
                }

                throw new Exception("Le chemin demandé n'existe pas");
            }
            catch (Exception ex)
            {
                // En cas d'erreur, retourne un JSON avec le message d'erreur
                return Json(new
                {
                    IsValid = false,
                    ErrorMessage = ex.Message
                });
            }
        }

        /// <summary>
        /// Sauvegarde une liste de navigation reçue au format JSON, met à jour les fichiers JSON
        /// correspondants sur le disque, et retourne une réponse JSON indiquant le succès ou l'échec de l'opération.
        /// </summary>
        /// <param name="list">Liste d'éléments de navigation au format JSON envoyée dans le corps de la requête HTTP POST.</param>
        /// <returns>Un objet JSON indiquant si l'opération a réussi ou échoué.</returns>
        [HttpPost]
        public IActionResult SaveNavigation([FromBody] JsonElement list)
        {
            try
            {
                // Récupération des chemins et autres paramètres depuis la configuration
                string navigationPath = _configuration.GetSection("VirtualsDirectories").GetSection("Navigation").Value;
                string jsonFileList = _configuration.GetSection("Navigation").GetSection("JsonFileList").Value;
                string jsonFileLive = _configuration.GetSection("Navigation").GetSection("JsonFileLive").Value;
                string jsonListPath = Path.Combine(navigationPath, jsonFileList);
                string jsonLivePath = Path.Combine(navigationPath, jsonFileLive);
                string jsonFilePrefixe = _configuration.GetSection("Navigation").GetSection("JsonFileItemPrefixe").Value;
                string jsonFileSuffixe = _configuration.GetSection("Navigation").GetSection("JsonFileItemSuffixe").Value;

                // Conversion du JsonElement en texte brut JSON
                string json = list.GetRawText();

                // Configuration des paramètres de désérialisation
                JsonSerializerSettings settings = new()
                {
                    TypeNameHandling = TypeNameHandling.Auto
                };

                // Désérialisation du JSON en une liste d'objets NavigationVM
                List<NavigationVM>? items = JsonConvert.DeserializeObject<List<NavigationVM>>(json, settings);

                // Initialisation des listes de navigation complète et live
                List<NavigationListItemVM> navigationFullList = new List<NavigationListItemVM>();
                List<NavigationVM> navigationLiveList = new List<NavigationVM>();

                if (items.Count > 0)
                {
                    foreach (NavigationVM item in items)
                    {
                        // Ajoute l'élément actuel à la liste complète de navigation
                        navigationFullList.Add(new NavigationListItemVM(item));

                        string path = Path.Combine(navigationPath, jsonFilePrefixe + item.Id + jsonFileSuffixe);
                        if (!System.IO.File.Exists(path))
                        {
                            using FileStream fs = System.IO.File.Create(path);
                        }

                        // S'il y a + d'un élément dans item.Items, c'est qu'il y a eu des modifications
                        if (item.Items.Count > 0)
                        {
                            // Alors on met à jour le JSON de l'élément
                            System.IO.File.WriteAllText(path, JsonConvert.SerializeObject(item, settings));
                        }

                        // Si la date de suppression > à maintenant, il faut que l'élément soit visible en prod pour l'ajouter à la liste live
                        if (item.DateDelete > DateTime.Now)
                        {
                            // Si l'élément n'a pas d'items c'est qu'il n'y a pas eu de modifications dessus, mais il faut récupérer les items pour construire la liste live
                            if (item.Items.Count == 0)
                            {
                                // On récupère les items sous la forme d'un JSON et on les convertit en NavigationVM
                                IActionResult result = GetNavigation(item.Id);
                                JsonResult jsonResult = result as JsonResult;
                                if (jsonResult?.Value is not null)
                                {
                                    // Extraire la propriété "Item" de la réponse JSON
                                    var resultData = jsonResult.Value as dynamic;
                                    if (resultData.IsValid)
                                    {
                                        item.Items = ((NavigationVM)resultData.Item).Items;
                                    }
                                    else
                                    {
                                        throw new Exception(resultData.ErrorMessage);
                                    }
                                }
                            }

                            // On ajoute l'élément à la liste live
                            navigationLiveList.Add(item);
                        }
                    }
                }

                if (!System.IO.File.Exists(jsonListPath))
                {
                    using FileStream fs = System.IO.File.Create(jsonListPath);
                }

                // MAJ de la liste complète
                System.IO.File.WriteAllText(jsonListPath, JsonConvert.SerializeObject(navigationFullList, settings));

                if (System.IO.File.Exists(jsonLivePath))
                {
                    using FileStream fs = System.IO.File.Create(jsonLivePath);
                }

                // MAJ de la liste live
                System.IO.File.WriteAllText(jsonLivePath, JsonConvert.SerializeObject(navigationLiveList, settings));

                return Json(new
                {
                    IsValid = true
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    IsValid = false,
                    ErrorMessage = ex.Message
                });
            }
        }
    }
}
