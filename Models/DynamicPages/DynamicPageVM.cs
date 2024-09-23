using ConsoleMatycom.Models.Components.Sections;

namespace ConsoleMatycom.Models.DynamicPages
{
    public class DynamicPageVM
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public int Directory { get; set; }
        public string SparkowId { get; set; }
        public List<SectionVM> Content { get; set; }
        public string HeadContent { get; set; }
        public string ScriptContent { get; set; }
        public DynamicPageVM()
        {
            Id = String.Empty;
            Title = String.Empty;
            Directory = 0;
            SparkowId = "/C-";
            Content = new List<SectionVM>();
        }
    }
}
