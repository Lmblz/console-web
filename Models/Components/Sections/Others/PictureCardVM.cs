using ConsoleMatycom.Models.Components.Sections.Cards;
using ConsoleMatycom.Models.Components.Sections.Images;
using ConsoleMatycom.Models.Components.Sections.Sliders;
using ConsoleMatycom.Models.Elements;

namespace ConsoleMatycom.Models.Components.Sections.Others
{
    public class PictureCardVM
    {
        public string _type { get; set; }
        public string Id { get; set; }
        public string Name { get; set; }
        public TitleVM TitleH2 { get; set; }
        public DescriptionVM Description { get; set; }
        public SimpleImageVM Image { get; set; }
        public string TypeCard { get; set; }
        public ProductCardVM Card { get; set; }
        public SimpleCardVM SimpleCard { get; set; }
        public PictureCardVM()
        {
            _type = "PictureCard";
            TitleH2 = new TitleVM();
            Description = new DescriptionVM();
            Image = new SimpleImageVM();
            TypeCard = "ProductCard";
            Card = new ProductCardVM();
            SimpleCard = new SimpleCardVM();
        }
    }
}
