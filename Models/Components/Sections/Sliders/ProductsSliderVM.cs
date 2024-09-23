namespace ConsoleMatycom.Models.Components.Sections.Sliders
{
    public class ProductsSliderVM
    {
        public string _type { get; set; }
        public string Id { get; set; }
        public string Name { get; set; }
        public string BackgroundColor { get; set; }
        public string MerchandisingActionCode { get; set; }

        public SliderDescriptionVM Description { get; set; }

        public ProductsSliderVM()
        {
            this._type = "ProductsSliderSection";
        }
    }
}
