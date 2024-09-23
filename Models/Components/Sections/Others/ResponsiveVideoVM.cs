namespace ConsoleMatycom.Models.Components.Sections.Others
{
    public class ResponsiveVideoVM
    {
        public VideoVM MobileVideo { get; set; }
        public VideoVM DesktopVideo { get; set; }
        public bool IsLazyLoad { get; set; }
        public string MinWidth { get; set; }
        public ResponsiveVideoVM()
        {
            MobileVideo = new VideoVM();
            DesktopVideo = new VideoVM();
            IsLazyLoad = true;
            MinWidth = "601";
        }
    }
}
