namespace ConsoleMatycom.Models.Components.Sections.Html
{
    public class RawHtmlVM
    {
        public string _type { get; set; }
        public int Id { get; set; }
        public string Name { get; set; }

        public string Html { get; set; }

        public RawHtmlVM()
        {
            this._type = "RawHtml";
        }
    }
}
