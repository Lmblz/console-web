using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Reflection.Metadata;
using System.Web.Helpers;
using System.IO;

namespace ConsoleMatycom.Controllers
{
    public class LibraryController : Controller
    {
        private IConfiguration _configuration;

        public LibraryController(IWebHostEnvironment webHostEnvironment, IConfiguration configuration)
        {
            _configuration = configuration;
        }


        public IActionResult GetDirectories(string directory)
        {
            try
            {
                string rootUrl = _configuration.GetSection("Library").GetSection("RootUrl").Value;
                string directoryPath = directory != null && directory != "" ? directory : rootUrl;

                if (!Directory.Exists(directoryPath))
                {
                    return StatusCode(404, new UploadResponse
                    {
                        IsValid = false,
                        AlreadyExists = false,
                        Message = $"Directory not found: {directory}"
                    });
                }

                string[] folders = Directory.GetDirectories(directoryPath);
                string[] files = Directory.GetFiles(directoryPath, "*.*", SearchOption.TopDirectoryOnly);

                return Json(new
                {
                    AlreadyExists = true,
                    Folders = folders,
                    Files = files,
                    IsValid = true
                });

            }
            catch (Exception ex)
            {
                return StatusCode(500, new UploadResponse
                {
                    IsValid = false,
                    Message = $"Internal server error: {ex.Message}"
                });
            }
        }

        public class UploadResponse
        {
            public bool IsValid { get; set; }
            public string? Message { get; set; }
            public bool? AlreadyExists { get; set; }
        }

        [HttpPost]
        public IActionResult UploadFiles([FromForm] IFormFile file, string? folder)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new UploadResponse
                {
                    IsValid = false,
                    Message = "No file uploaded."
                });
            }

            try
            {
                string rootUrl = _configuration.GetSection("Library").GetSection("RootUrl").Value;
                string uploadPath = !string.IsNullOrEmpty(folder) ? folder : rootUrl;

                if (!Directory.Exists(uploadPath))
                {
                    return StatusCode(404, new UploadResponse
                    {
                        IsValid = false,
                        Message = $"Directory not found: {folder}"
                    });
                }

                // Chemin complet du fichier
                string filePath = Path.Combine(uploadPath, file.FileName);

                // Enregistrer le fichier
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    file.CopyTo(stream);
                }

                return Ok(new UploadResponse
                {
                    IsValid = true,
                    Message = "File uploaded successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new UploadResponse
                {
                    IsValid = false,
                    Message = $"Internal server error: {ex.Message}"
                });
            }
        }

        public IActionResult DeleteFile(string filePath)
        {
            if (filePath == null || filePath == string.Empty)
            {
                return StatusCode(404, new UploadResponse
                {
                    IsValid = false,
                    Message = $"No path"
                });
            }
            try
            {
                if (!System.IO.File.Exists(filePath))
                {
                    return StatusCode(404, new UploadResponse
                    {
                        IsValid = false,
                        Message = $"File not found: {filePath}"
                    });
                }

                System.IO.File.Delete(filePath);

                return Ok(new UploadResponse
                {
                    IsValid = true,
                    Message = "File deleted successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new UploadResponse
                {
                    IsValid = false,
                    Message = $"Internal server error: {ex.Message}"
                });
            }
        }

        public IActionResult CreateNewFolder(string newPath)
        {
            if (newPath == null || newPath == string.Empty)
            {
                return StatusCode(404, new UploadResponse
                {
                    IsValid = false,
                    Message = $"No path"
                });
            }

            try
            {
                if (Directory.Exists(newPath))
                {
                    return StatusCode(500, new UploadResponse
                    {
                        IsValid = false,
                        AlreadyExists = true,
                        Message = $"A directory with this name already exists"
                    });
                }

                Directory.CreateDirectory(newPath);

                return Ok(new UploadResponse
                {
                    IsValid = true,
                    Message = "Directory created successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new UploadResponse
                {
                    IsValid = false,
                    Message = $"Internal server error: {ex.Message}"
                });

            }
        }

    }
}
