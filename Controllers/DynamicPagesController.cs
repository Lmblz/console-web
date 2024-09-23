
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using NuGet.Configuration;
using System;
using System.IO;
using ConsoleMatycom.Models.DynamicPages;
using ConsoleMatycom.Models.HomePages;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Text;
using System.Web.Helpers;
using NuGet.Protocol;

namespace ConsoleMatycom.Controllers
{
    public class DynamicPagesController : Controller
    {
        private IConfiguration _configuration;

        public DynamicPagesController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public IActionResult GetList()
        {
            string dynamicPagesPath = _configuration.GetSection("VirtualsDirectories").GetSection("DynamicPages").Value;
            string listPath = _configuration.GetSection("DynamicPages").GetSection("List").Value;
            string fullPath = dynamicPagesPath + "/" + listPath;

            List<DynamicPageLight> list = new();

            if (System.IO.File.Exists(fullPath))
            {
                using StreamReader reader = new(fullPath);
                var json = reader.ReadToEnd();

                if (json != null)
                {
                    list = JsonConvert.DeserializeObject<List<DynamicPageLight>>(json);
                }
            }
            
            if (list != null) {
                return Json(new
                {
                    Pages = list,
                    IsValid = true
                });
            }

            return Json(new
            {
                IsValid = false
            });
        }

        public DynamicPageVM GetPage(int directoryId)
        {
            DynamicPageVM vm = new();
            string dynamicPagesPath = _configuration.GetSection("VirtualsDirectories").GetSection("DynamicPages").Value;
            string pagePath = dynamicPagesPath + "/" + directoryId + "/content.json";

            if (System.IO.File.Exists(pagePath))
            {
                using StreamReader reader = new(pagePath);
                var json = reader.ReadToEnd();

                JsonSerializerSettings settings = new JsonSerializerSettings
                {
                    TypeNameHandling = TypeNameHandling.All,
                    MetadataPropertyHandling = MetadataPropertyHandling.ReadAhead
                };

                if (json != null)
                {
                    vm = JsonConvert.DeserializeObject<DynamicPageVM>(json, settings);
                }
            }

            return vm;
        }

        [HttpPost]
        public IActionResult SavePages([FromBody] dynamic jsoncontent)

        {
            try
            {
                string json = ((System.Text.Json.JsonElement)jsoncontent).GetRawText();

                JsonSerializerSettings settings = new JsonSerializerSettings
                {
                    TypeNameHandling = TypeNameHandling.All,
                    MetadataPropertyHandling = MetadataPropertyHandling.ReadAhead
                };

                List<DynamicPageVM>? pages = JsonConvert.DeserializeObject<List<DynamicPageVM>>(json, settings);

                if (pages == null || pages.Count == 0)
                {
                    return Json(new
                    {
                        Pages = pages,
                        IsValid = false,
                        ErrorMessage = "DynamicPages null or empty"
                    });
                }

                string dynamicPagesPath = _configuration.GetSection("VirtualsDirectories").GetSection("DynamicPages").Value;

                pages.ForEach(page =>
                {
                    string pagePath = dynamicPagesPath + "/" + page.Directory + "/content.json";
                    System.IO.File.WriteAllText(pagePath, JsonConvert.SerializeObject(page, settings));

                    DynamicPageLight dpl = new()
                    {
                        Id = page.Id,
                        Title = page.Title,
                        Directory = page.Directory,
                    };

                    UpdatePage(dpl);
                });


                return Json(new
                {
                    Pages = pages,
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

        [HttpPost]
        public IActionResult CreatePage(string newId)
        {
            try
            {
                List<DynamicPageLight> list = new List<DynamicPageLight>();
                var response = GetList() as JsonResult;

                if (response != null)
                {
                    var value = response.Value as dynamic;

                    if (value != null && value.IsValid)
                    {
                        list = value.Pages;
                    }
                }

                int newDirectory;

                if (list.Count == 0)
                {
                    newDirectory = 1;
                }
                else
                {
                    newDirectory = list.Max(el => el.Directory) + 1;
                }


                DynamicPageLight newPage = new()
                {
                    Id = newId,
                    Directory = newDirectory,
                    Title = "Nouvelle page"
                };

                list.Insert(0, newPage);

                string dynamicPagesPath = _configuration.GetSection("VirtualsDirectories").GetSection("DynamicPages").Value;
                string listPath = _configuration.GetSection("DynamicPages").GetSection("List").Value;
                string fullPath = dynamicPagesPath + "/" + listPath;
                string newPagePath = dynamicPagesPath + "/" + newDirectory;
                string jsonPathNewPage = newPagePath + "/content.json";

                if (!System.IO.File.Exists(fullPath))
                {
                    using FileStream fs = System.IO.File.Create(fullPath);
                    byte[] baseContent = new UTF8Encoding(true).GetBytes(JsonConvert.SerializeObject(list));
                    fs.Write(baseContent, 0, baseContent.Length);
                }

                System.IO.File.WriteAllText(fullPath, JsonConvert.SerializeObject(list));


                if (Directory.Exists(newPagePath))
                {
                    return Json(new
                    {
                        IsValide = false,
                        ErrorMessage = "Ce dossier existe déja"
                    });
                }

                Directory.CreateDirectory(newPagePath);

                DynamicPageVM dynamicPageVM = new()
                {
                    Id = newId,
                    Directory = newDirectory,
                    Title = "Nouvelle page",
                    SparkowId = "/C-",
                };

                using (FileStream fs = System.IO.File.Create(jsonPathNewPage))
                {
                    byte[] baseContent = new UTF8Encoding(true).GetBytes(JsonConvert.SerializeObject(dynamicPageVM));
                    fs.Write(baseContent, 0, baseContent.Length);
                }

                return Json(new
                {
                    Pages = list,
                    IsValid = true,
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
        public IActionResult UpdatePage(DynamicPageLight page)
        {
            try
            {
                string directory = _configuration.GetSection("VirtualsDirectories").GetSection("DynamicPages").Value;
                string file = _configuration.GetSection("DynamicPages").GetSection("List").Value;
                string path = directory + "/" + file;

                if (!System.IO.File.Exists(path))
                {
                    return Json(new
                    {
                        IsValid = false,
                        Error = "Le chemin du fichier n'existe pas : " + path
                    });
                }

                string json = System.IO.File.ReadAllText(path);

                if (json == null)
                {
                    return Json(new
                    {
                        IsValid = false,
                        Error = "Le fichier liste est vide"
                    });
                }

                List<DynamicPageLight> list = JsonConvert.DeserializeObject<List<DynamicPageLight>>(json);

                DynamicPageLight? el = list.Find(p => p.Directory == page.Directory);

                if (el == null)
                {
                    return Json(new
                    {
                        IsValid = false,
                        Error = "La page n'existe pas"
                    });
                }

                el.Title = page.Title;

                if (list != null)
                {
                    JsonSerializerSettings settings = new JsonSerializerSettings
                    {
                        TypeNameHandling = TypeNameHandling.All,
                        MetadataPropertyHandling = MetadataPropertyHandling.ReadAhead
                    };

                    System.IO.File.WriteAllText(path, JsonConvert.SerializeObject(list, settings));
                }

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
                    Error = ex.Message
                });
            }
        }
    }
}
