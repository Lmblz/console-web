namespace ConsoleMatycom.Models.Components.Sections.Images
{
    public class ResponsivePictureVM
    {
        public PictureVM MobilePicture { get; set; }
        public PictureVM DesktopPicture { get; set; }
        public bool IsLazyLoad { get; set; } = true;
        public string MinWidth { get; set; } = "601";
        public string FetchPriority { get; set; }
        public string Alt { get; set; }
        public ResponsivePictureVM()
        {
            MobilePicture = new PictureVM();
            DesktopPicture = new PictureVM();
            IsLazyLoad = true;
            FetchPriority = string.Empty;
            Alt = string.Empty;
        }
    }
}
