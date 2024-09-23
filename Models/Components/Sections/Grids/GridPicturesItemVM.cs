using ConsoleMatycom.Models.Components.Sections.Images;
using ConsoleMatycom.Models.Components.Sections.Others;
using ConsoleMatycom.Models.Elements;

namespace ConsoleMatycom.Models.Components.Sections.Grids
{
    public class GridPicturesItemVM
    {
        public string Id { get; set; }
        public string? AdditionnalClass { get; set; }
        public string MediaType { get; set; }
        public string MediaFormat { get; set; }
        public ResponsivePictureVM Picture { get; set; }
        public ResponsiveVideoVM Video { get; set; }
        public TitleVM Title { get; set; }
        public DescriptionVM Description { get; set; }
        public List<ButtonVM> Buttons { get; set; }
        public GridPicturesItemVM()
        {
            MediaType = "Picture";
            MediaFormat = "DemiBanner";
            Picture = new ResponsivePictureVM();
            Video = new ResponsiveVideoVM();
            Title = new TitleVM();
            Description = new DescriptionVM();
            Buttons = new List<ButtonVM>();
        }
    }
}
