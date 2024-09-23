using ConsoleMatycom.Models.Elements;

namespace ConsoleMatycom.Models.Components.Sections.Others
{
    public class SimpleTextVM
    {
        public string _type { get; set; }
        public string Id { get; set; }
        public string Name { get; set; }
        public TitleVM TitleH1 { get; set; }
        public TitleVM TitleH2 { get; set; }
        public TitleVM TitleH3 { get; set; }
        public DescriptionVM Description { get; set; }
        public ButtonVM Button { get; set; }
        public SimpleTextVM()
        {
            _type = "SimpleText";
            TitleH1 = new TitleVM();
            TitleH2 = new TitleVM();
            TitleH3 = new TitleVM();
            Description = new DescriptionVM();
            Button = new ButtonVM();
        }
    }
}
