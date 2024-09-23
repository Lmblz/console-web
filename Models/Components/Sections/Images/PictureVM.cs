namespace ConsoleMatycom.Models.Components.Sections.Images
{
    public class PictureVM
    {
        public string Url { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public string Extension { get; set; } = "jpg";

        public PictureVM()
        {
                
        }
    }
}
