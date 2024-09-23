using ConsoleMatycom.Models.Components.Sections.Images;
using ConsoleMatycom.Models.Elements;

namespace ConsoleMatycom.Models.Components.Sections.Banners
{
    public class BannerSliderItemVM
    {
        public string Id { get; set; }
        public decimal Position { get; set; }
        public List<BannerSliderItemContentVM> DesktopContent { get; set; }
        public BannerSliderItemContentVM MobileContent { get; set; }
        public TitleVM TitleH1 { get; set; }
        public TitleVM TitleH2 { get; set; }
        public ButtonVM Button {  get; set; }
        public string Type {  get; set; }
        public BannerSliderItemVM() { }
    }
}