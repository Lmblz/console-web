using ConsoleMatycom.Models.Hellobars;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace ConsoleMatycom.Controllers
{
    /// <summary>
    /// Gestion des hellobars
    /// </summary>
    public class HelloBarController : Controller
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        private IConfiguration _configuration;

        public HelloBarController(IWebHostEnvironment webHostEnvironment, IConfiguration configuration)
        {
            _webHostEnvironment = webHostEnvironment;
            _configuration = configuration;
        }

        /// <summary>
        /// Publier les modifications en recette
        /// </summary>
        /// <param name="hellobars">Liste des hellobars</param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult Save([FromBody] List<HelloBarVM> hellobars)
        {
            // TODO : implémenter les LOGS (try catch)
            try
            {
                if (hellobars != null && hellobars.Count > 0)
                {
                    // On filtre les hellos bars actives et à venir
                    List<HelloBarVM> activesHellobars = hellobars.Where(h => h.publication.dateDelete.CompareTo(DateTime.Now) >= 0).ToList();

                    // On récupère les infos dynamiquement 
                    string hellobarsPath = _configuration.GetSection("VirtualsDirectories").GetSection("Hellobars").Value;
                    string publishJsonFile = _configuration.GetSection("Hellobars").GetSection("PublishJsonFile").Value;
                    string jsonFile = _configuration.GetSection("Hellobars").GetSection("JsonFile").Value;

                    string pathPublish = Path.Combine(hellobarsPath, publishJsonFile);
                    string path = Path.Combine(hellobarsPath, jsonFile);

                    // On met à jour le fichier pour le site web
                    System.IO.File.WriteAllText(pathPublish, JsonConvert.SerializeObject(activesHellobars));

                    // On met à jour le fichier de travail
                    System.IO.File.WriteAllText(path, JsonConvert.SerializeObject(hellobars));

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
                        ErrorMessage = "Hellobars null or empty"
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

        /// <summary>
        /// Récupérer les hellobars
        /// </summary>
        /// <returns>Fichier json contenant les hellobars</returns>
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                string hellobarsPath = _configuration.GetSection("VirtualsDirectories").GetSection("Hellobars").Value;
                string jsonFile = _configuration.GetSection("Hellobars").GetSection("JsonFile").Value;

                string path = Path.Combine(hellobarsPath, jsonFile);

                // On récupère les hellobars du fichier de travail
                using StreamReader reader = new(path);
                var json = reader.ReadToEnd();
                List<HelloBarVM> hellobars = JsonConvert.DeserializeObject<List<HelloBarVM>>(json);

                return Json(hellobars);
            }
            catch(Exception ex)
            {
                return Json(new
                {
                    IsValid = false,
                    ErrorMessage = ex.Message
                });
            }
            
        }

        /// <summary>
        /// Récupère la configuration 
        /// </summary>
        /// <param name="sectionName"></param>
        /// <param name="paramName"></param>
        /// <returns></returns>
        //[HttpGet]
        //public ActionResult GetConfigurationValue(string sectionName, string paramName)
        //{
        //    if(string.IsNullOrEmpty(sectionName) && string.IsNullOrEmpty(paramName))
        //    {
        //        var parameterValue = _configuration[$"{sectionName}:{paramName}"];
        //        return Json(new 
        //        { 
        //            Parameter = parameterValue,
        //            IsValid = true
        //        }
        //        );

        //    }
        //    else
        //    {
        //        return Json(new
        //        {
        //            IsValid = false,
        //            ErrorMessage = "Parameters null or empty"
        //        });
        //    }
        //}
    }
}
