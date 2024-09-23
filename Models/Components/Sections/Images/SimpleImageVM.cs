
namespace ConsoleMatycom.Models.Components.Sections.Images
{
    public class SimpleImageVM
    {
        public string Id { get; set; }
        public int Position { get; set; }
        public string Url { get; set; }
        public string Title { get; set; }
        public ResponsivePictureVM Picture { get; set; }
        public SimpleImageVM() { }
    }
}