namespace ConsoleMatycom.Models.Components.Sections.Banners
{
    public class BannerSliderItemContentVM
    {
        public bool IsPicture { get; set; }
        public string DesktopUrl { get; set; } 
        public string MobileUrl { get; set; }
        public string Alt {  get; set; }
        public BannerSliderItemContentVM() 
        {
            IsPicture = true;
            DesktopUrl = string.Empty;
            MobileUrl = string.Empty;
            Alt = string.Empty;
        }
    }
}
