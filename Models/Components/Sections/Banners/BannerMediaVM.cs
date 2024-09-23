using ConsoleMatycom.Models.Components.Sections.Images;
using ConsoleMatycom.Models.Elements;

namespace ConsoleMatycom.Models.Components.Sections.Banners
{
    public class BannerMediaVM
    {
        public string _type { get; set; }
        public string Id { get; set; }
        public string Name { get; set; }
        public TitleVM Title { get; set; }
        public ResponsivePictureVM Picture { get; set; }
        public BannerMediaContentVM? Content { get; set; }
        public BannerMediaVM()
        {
            _type = "BannerMedia";
            Id = String.Empty;
            Name = String.Empty;
            Picture = new ResponsivePictureVM();
            Title = new TitleVM();
        }
    }
}
