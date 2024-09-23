using ConsoleMatycom.Models.Components.Sections.Images;
using ConsoleMatycom.Models.Elements;
using ConsoleMatycom.Models.Utils;

namespace ConsoleMatycom.Models.Components.Sections.Cards
{
    public class ProductCardVM
    {
        public string Title { get; set; }
        public string Brand { get; set; }
        public PriceVM Price { get; set; }
        public string EncodedUrl { get; set; }
        public PictureVM Picture {  get; set; }
        public ButtonVM Button { get; set; }
        public ProductCardVM() 
        {
            Title = String.Empty;
            Brand = String.Empty;
            EncodedUrl = String.Empty;
            Price = new PriceVM(0);
            Picture = new PictureVM();
            Button = new ButtonVM();
        }
    }
}
