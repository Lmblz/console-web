using ConsoleMatycom.Models.Elements;

namespace ConsoleMatycom.Models.Components.Sections.Others
{
    public class SimpleListingVM
    {
        public string _type { get; set; }
        public string Id { get; set; }
        public string Name { get; set; }
        public TitleVM Title { get; set; }
        public List<SimpleListingContentVM> Content { get; set; }
        public SimpleListingVM()
        {
            _type = "SimpleListing";
            Title = new TitleVM();
            Content = new List<SimpleListingContentVM>();
        }
    }
}
