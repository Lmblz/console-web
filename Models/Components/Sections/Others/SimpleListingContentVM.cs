using ConsoleMatycom.Models.Components.Sections.Images;
using ConsoleMatycom.Models.Elements;

namespace ConsoleMatycom.Models.Components.Sections.Others
{
    public class SimpleListingContentVM
    {
        public TitleVM Title { get; set; }
        public DescriptionVM Description { get; set; }
        public ResponsivePictureVM Picture { get; set; }
        public SimpleListingContentVM() 
        {
            Title = new TitleVM();
            Description = new DescriptionVM();
            Picture = new ResponsivePictureVM();
        }
    }
}
