using ConsoleMatycom.Models.Elements;

namespace ConsoleMatycom.Models.Components.Sections.Cards
{
    public class SimpleCardVM
    {
        public TitleVM TitleH3 { get; set; }
        public DescriptionVM Description { get; set; }
        public ButtonVM Button { get; set; }
        public SimpleCardVM()
        {
            TitleH3 = new TitleVM();
            Description = new DescriptionVM();
            Button = new ButtonVM()
            {
                Class = "button -link -underline -bold"
            };
        }
    }
}
