using ConsoleMatycom.Models.Elements;

namespace ConsoleMatycom.Models.Components.Sections.Banners
{
    public class BannerMediaContentVM
    {
        public TitleVM TitleH2 { get; set; }
        public DescriptionVM Description {  get; set; }
        public ButtonVM Button { get; set; }
        public BannerMediaContentVM() {
            TitleH2 = new TitleVM();
            Description = new DescriptionVM();
            Button = new ButtonVM();
        }
    }
}
