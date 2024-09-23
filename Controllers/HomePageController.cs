using ConsoleMatycom.Models.HomePages;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NuGet.Configuration;

namespace ConsoleMatycom.Controllers
{
    public class HomePageController : Controller
    {
        private IConfiguration _configuration;

        public HomePageController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                string homepagesPath = _configuration.GetSection("VirtualsDirectories").GetSection("HomePages").Value;
                string jsonFile = _configuration.GetSection("HomePages").GetSection("JsonFile").Value;

                string path = Path.Combine(homepagesPath, jsonFile);

                if (System.IO.File.Exists(path))
                {
                    // On récupère les homepages du fichier de travail
                    using StreamReader reader = new(path);
                    var json = reader.ReadToEnd();

                    // Uitilisation des settings pour gérer l'héritage des sections
                    JsonSerializerSettings settings = new JsonSerializerSettings
                    {
                        TypeNameHandling = TypeNameHandling.All,
                        MetadataPropertyHandling = MetadataPropertyHandling.ReadAhead
                    };

                    List<HomepageVM>? homepages = JsonConvert.DeserializeObject<List<HomepageVM>>(json, settings);

                    if (homepages == null)
                    {
                        homepages = new List<HomepageVM>();
                    }

                    return Json(homepages);
                }
                else
                {
                    return Json(new List<HomepageVM>());
                }
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

        [HttpPost]
        public IActionResult Save([FromBody] dynamic jsoncontent)
        {
            try
            {
                string json = ((System.Text.Json.JsonElement)jsoncontent).GetRawText();

                JsonSerializerSettings settings = new JsonSerializerSettings
                {
                    TypeNameHandling = TypeNameHandling.Auto
                };

                List<HomepageVM>? homepages = JsonConvert.DeserializeObject<List<HomepageVM>>(json, settings);

                if (homepages != null && homepages.Count > 0)
                {
                    // On filtre les homepages actives et à venir
                    List<HomepageVM> activesHomepages = homepages.Where(h => h.DateDelete.CompareTo(DateTime.Now) >= 0).ToList();

                    // On récupère les infos dynamiquement 
                    string homepagesPath = _configuration.GetSection("VirtualsDirectories").GetSection("HomePages").Value;
                    string publishJsonFile = _configuration.GetSection("HomePages").GetSection("PublishJsonFile").Value;
                    string jsonFile = _configuration.GetSection("HomePages").GetSection("JsonFile").Value;

                    string pathPublish = Path.Combine(homepagesPath, publishJsonFile);
                    string path = Path.Combine(homepagesPath, jsonFile);

                    // On met à jour le fichier pour le site web (sans les settings, le site se base sur la propriété _type (via AnimationWeb et le custom converter)
                    System.IO.File.WriteAllText(pathPublish, JsonConvert.SerializeObject(activesHomepages));

                    // On met à jour le fichier de travail (avec les settings
                    System.IO.File.WriteAllText(path, JsonConvert.SerializeObject(homepages, settings));

                    return Json(new
                    {
                        IsValid = true
                    });
                }
                else
                {
                    return Json(new
                    {
                        IsValid = false,
                        ErrorMessage = "HomePages null or empty"
                    });
                }
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