using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.IO;
using ConsoleMatycom.Models.Conditions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net;

namespace ConsoleMatycom.Controllers
{
    public class ConditionsController : Controller
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        private IConfiguration _configuration;
        private static readonly HttpClient client = new();


        public ConditionsController(IWebHostEnvironment webHostEnvironment, IConfiguration configuration)
        {
            _webHostEnvironment = webHostEnvironment;
            _configuration = configuration;
        }

        /// <summary>
        /// Get condition page by name
        /// </summary>
        /// <param name="page_name">Nom de la page</param>
        /// <returns></returns>
        [HttpGet]
        public IActionResult GetPage(string page_name)
        {
            try
            {
                string conditionsPath = _configuration.GetSection("VirtualsDirectories").GetSection("Conditions").Value;
                string jsonFile = _configuration.GetSection("Conditions").GetSection(page_name).GetSection("JsonFile").Value;

                string path = Path.Combine(conditionsPath, jsonFile);

                if (path == null)
                {
                    return Json(new
                    {
                        IsValid = false,
                        ErrorMessage = "Path is not defined"
                    });
                }

                // READ FILE
                using StreamReader reader = new(path);
                var json = reader.ReadToEnd();

                if (json != null)
                {
                    List<ConditionsVM> conditions = JsonConvert.DeserializeObject<List<ConditionsVM>>(json);
                    return Json(conditions);
                }
                return Json(new
                {
                    IsValid = false,
                    ErrorMessage = "Unable to get page"
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

        /// <summary>
        /// Get list of condition by name
        /// </summary>
        /// <param name="condition_name">Nom de la page</param>
        /// <returns></returns>
        [HttpGet]
        public IActionResult GetList(string condition_name)
        {
            try
            {
                string conditionsPath = _configuration.GetSection("VirtualsDirectories").GetSection("Conditions").Value;
                string conditionPath = _configuration.GetSection("Conditions").GetSection(condition_name).GetSection("Directory").Value;
                string jsonFile = _configuration.GetSection("Conditions").GetSection(condition_name).GetSection("JsonFileList").Value;

                string path = Path.Combine(conditionsPath, conditionPath, jsonFile);

                if (path == null)
                {
                    return Json(new
                    {
                        IsValid = false,
                        ErrorMessage = "Path is not defined"
                    });
                }

                // READ FILE
                using StreamReader reader = new(path);
                var json = reader.ReadToEnd();

                if (json != null)
                {
                    List<ConditionsVM> conditions = JsonConvert.DeserializeObject<List<ConditionsVM>>(json);
                    return Json(conditions);
                }
                return Json(new
                {
                    IsValid = false,
                    ErrorMessage = "Unable to get page"
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

        /// <summary>
        /// Post condition page by name
        /// </summary>
        /// <param name="condition_name">Nom de la page</param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult SaveCondition(string condition_name, [FromBody] dynamic jsoncontent)
        {
            try
            {
                string json = ((System.Text.Json.JsonElement)jsoncontent).GetRawText();

                JsonSerializerSettings settings = new JsonSerializerSettings
                {
                    TypeNameHandling = TypeNameHandling.Auto
                };

                List<ConditionsVM>? conditions = JsonConvert.DeserializeObject<List<ConditionsVM>>(json, settings);

                if (conditions != null && conditions.Count > 0)
                {
                    List<ConditionsVM> activeConditions = conditions.Where(h => h.DateDelete.CompareTo(DateTime.Now) > 0).ToList();

                    string conditionsPath = _configuration.GetSection("VirtualsDirectories").GetSection("Conditions").Value;
                    string conditionPath = _configuration.GetSection("Conditions").GetSection(condition_name).GetSection("Directory").Value;
                    string jsonFileLive = _configuration.GetSection("Conditions").GetSection(condition_name).GetSection("JsonFileLive").Value;
                    string jsonFile = _configuration.GetSection("Conditions").GetSection(condition_name).GetSection("JsonFileList").Value;

                    string pathLive = Path.Combine(conditionsPath, conditionPath, jsonFileLive);
                    string path = Path.Combine(conditionsPath, conditionPath, jsonFile);

                    System.IO.File.WriteAllText(pathLive, JsonConvert.SerializeObject(activeConditions, settings));
                    System.IO.File.WriteAllText(path, JsonConvert.SerializeObject(conditions, settings));

                    return Json(new { IsValid = true, });
                }
                else
                {
                    return Json(new { IsValid = false, });
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
        public async Task<IActionResult> GeneratePdf(string condition_name)
        {
            try
            {
                using (var client = new HttpClient())
                {
                    string pdfRootUrl = _configuration.GetSection("Conditions").GetSection("PdfRootUrl").Value;
                    string conditionUrl = _configuration.GetSection("Conditions").GetSection(condition_name).GetSection("Directory").Value.Replace("/", "");;
                    string converterUrl = _configuration.GetSection("Conditions").GetSection("PdfConverterUrl").Value;
                    var request = new HttpRequestMessage(HttpMethod.Post, converterUrl);
                    var content = new MultipartFormDataContent();
                    content.Add(new StringContent(pdfRootUrl + conditionUrl), "url");
                    request.Content = content;

                    var response = await client.SendAsync(request);
                    response.EnsureSuccessStatusCode();

                    var pdfContent = await response.Content.ReadAsStreamAsync();

                    string conditionsPath = _configuration.GetSection("VirtualsDirectories").GetSection("Conditions").Value;
                    string conditionPath = _configuration.GetSection("Conditions").GetSection(condition_name).GetSection("Directory").Value;

                    string directoryPath = Path.Combine(conditionsPath, conditionPath);

                    // Assurez-vous que le répertoire existe
                    Directory.CreateDirectory(directoryPath);

                    string filePath = Path.Combine(directoryPath, conditionUrl + ".pdf");

                    using (var fileStream = new FileStream(filePath, FileMode.Create, FileAccess.Write, FileShare.None))
                    {
                        await pdfContent.CopyToAsync(fileStream);
                    }

                    var pdfSharedDirectory = _configuration.GetSection("Conditions").GetSection(condition_name).GetSection("PdfSharedDirectory").Value;

                    if (pdfSharedDirectory != null)
                    {
                        Directory.CreateDirectory(pdfSharedDirectory);
                        string pdfFileName = _configuration.GetSection("Conditions").GetSection(condition_name).GetSection("PdfFileName").Value;
                        string pdfPath = Path.Combine(pdfSharedDirectory, pdfFileName + ".pdf");
                        System.IO.File.Copy(filePath, pdfPath, true);
                    }

                    return Json(new
                    {
                        IsValid = true,
                        FilePath = filePath
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
