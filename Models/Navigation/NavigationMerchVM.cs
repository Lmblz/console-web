using ConsoleMatycom.Models.Elements;

namespace ConsoleMatycom.Models.Navigation
{
    public class NavigationMerchVM
    {
        public string ImageUrl { get; set; }
        public string ImageAlt { get; set; }
        public string Url { get; set; }
        public string EncodedUrl { get; set; }
        public string Description { get; set; }
        public ButtonVM Button { get; set; }

        public NavigationMerchVM()
        {
            ImageUrl = string.Empty;
            ImageAlt = string.Empty;
            Url = string.Empty;
            EncodedUrl = string.Empty;
            Description = string.Empty;
            Button = new ButtonVM();
        }
    }
}
