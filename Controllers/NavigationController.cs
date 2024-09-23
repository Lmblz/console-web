using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Linq;

namespace ConsoleMatycom.Controllers
{
    public class NavigationController : ControllerBase
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        private IConfiguration _configuration;

        public NavigationController(IWebHostEnvironment webHostEnvironment, IConfiguration configuration)
        {
            _webHostEnvironment = webHostEnvironment;
            _configuration = configuration;
        }

        [HttpGet]
        public JsonResult GoToPage(string actionName)
        {
            bool allowAccess = false;

            switch (actionName)
            {
                case "HelloBars":
                    allowAccess = HttpContext.User.Identity.IsAuthenticated &&
                                  (HttpContext.User.IsInRole("MATY\\Nimo_Editeurs") ||
                                   HttpContext.User.IsInRole("MATY\\Nimo_ResponsablesMkt") ||
                                   HttpContext.User.IsInRole("MATY\\Nimo_Développeurs") ||
                                   HttpContext.User.IsInRole("MATY\\Nimo_Administrateurs"));
                    break;

                case "Homepages":
                    allowAccess = HttpContext.User.Identity.IsAuthenticated &&
                                  (HttpContext.User.IsInRole("MATY\\Nimo_Editeurs") ||
                                   HttpContext.User.IsInRole("MATY\\Nimo_ResponsablesMkt") ||
                                   HttpContext.User.IsInRole("MATY\\Nimo_Développeurs") ||
                                   HttpContext.User.IsInRole("MATY\\Nimo_Administrateurs"));
                    break;

                case "Conditions":
                    allowAccess = HttpContext.User.Identity.IsAuthenticated &&
                                  (HttpContext.User.IsInRole("MATY\\Nimo_Juridique") ||
                                   HttpContext.User.IsInRole("MATY\\Nimo_Développeurs") ||
                                   HttpContext.User.IsInRole("MATY\\Nimo_Administrateurs"));
                    break;
                case "DynamicPages":
                    allowAccess = HttpContext.User.Identity.IsAuthenticated &&
                                  (HttpContext.User.IsInRole("MATY\\Nimo_Editeurs") ||
                                   HttpContext.User.IsInRole("MATY\\Nimo_ResponsablesMkt") ||
                                   HttpContext.User.IsInRole("MATY\\Nimo_Développeurs") ||
                                   HttpContext.User.IsInRole("MATY\\Nimo_Administrateurs"));
                    break;
                case "Navigation":
                    allowAccess = HttpContext.User.Identity.IsAuthenticated &&
                                  //HttpContext.User.IsInRole("MATY\\Nimo_Editeurs") ||
                                  // HttpContext.User.IsInRole("MATY\\Nimo_ResponsablesMkt") ||
                                   HttpContext.User.IsInRole("MATY\\Nimo_Développeurs") ||
                                   HttpContext.User.IsInRole("MATY\\Nimo_Administrateurs");
                    break;
                default:
                    allowAccess = false;
                    break;
            }

            return new JsonResult(new { AllowAccess = allowAccess });
        }

        [HttpGet]
        public IActionResult GetUser()
        {
            if (HttpContext.User.Identity.IsAuthenticated)
            {
                return new JsonResult(new
                {
                    Success = true,
                    Name = HttpContext.User.Identity.Name
                });
            }

            return new JsonResult(new
            {
                Success = false
            });
        }

        [HttpPost]
        public void PostUserLog(string domain, string user, string infos)
        {
            try
            {
                string path = _configuration.GetSection("VirtualsDirectories").GetSection(domain).Value;
                string fullPath = Path.Combine(path, "edits.txt");

                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }

                string newLine = user + " " + domain + " " + DateTime.Now;
                if (infos != null) newLine += " - " + infos;

                string[] existingLines = Array.Empty<string>();

                if (System.IO.File.Exists(fullPath))
                {
                    existingLines = System.IO.File.ReadAllLines(fullPath);
                }

                using (StreamWriter writer = new StreamWriter(fullPath))
                {
                    writer.WriteLine(newLine);
                    foreach (string line in existingLines)
                    {
                        writer.WriteLine(line);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }

        [HttpGet]
        public string[] GetUserLog(string domain) 
        {
            try
            {
                string path = _configuration.GetSection("VirtualsDirectories").GetSection(domain).Value;
                string fullPath = Path.Combine(path, "edits.txt");

                string[] existingLines = Array.Empty<string>();

                if (Directory.Exists(path))
                {
                    if (System.IO.File.Exists(fullPath))
                    {
                        existingLines = System.IO.File.ReadAllLines(fullPath);
                    }
                }

                return existingLines;
            }
            catch( Exception ex)
            {
                return new string[1];
                throw new Exception(ex.Message);
            }
        }
    }
}
