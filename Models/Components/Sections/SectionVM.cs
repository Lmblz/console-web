namespace ConsoleMatycom.Models.Components.Sections
{
    public class SectionVM
    {
        public string Name { get; set; }
        public int DisplayOrder { get; set; }
        public string Id { get; set; }
        public string Class { get; set; }
        public string ViewUrl { get; set; }
        public string BackgroundColor { get; set; } = "white";
        public object Content { get; set; }
        public SectionVM()
        {

        }
    }
}
