using ConsoleMatycom.Models.Elements;

namespace ConsoleMatycom.Models.Components.Sections.Images
{
    public class SimpleImagesVM
    {
        public string _type { get; set; }
        public string Id { get; set; }
        public string Name { get; set; }
        public TitleVM Title { get; set; }
        public List<SimpleImageVM> Images { get; set; }
        public DescriptionVM Description { get; set; }
        public bool IsSlider { get; set; }
        public SimpleImagesVM()
        {
            _type = "SimpleImages";
            Title = new TitleVM();
            Images = new List<SimpleImageVM>();
            Description = new DescriptionVM();
            IsSlider = false;
        }
    }
}