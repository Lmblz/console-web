using ConsoleMatycom.Models.Components.Sections.Images;

namespace ConsoleMatycom.Models.Components.Sections.Others
{
    public class VideoVM
    {
        public string Url { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public string Extension { get; set; }
        public PictureVM Poster { get; set; }
        public VideoVM() 
        {
            Url = string.Empty;
            Width = 0;
            Height = 0;
            Extension = "mp4";
            Poster = new PictureVM();
        }
    }
}
