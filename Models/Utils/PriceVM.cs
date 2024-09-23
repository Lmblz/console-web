namespace ConsoleMatycom.Models.Utils
{
    public class PriceVM
    {
        public decimal SellingPrice { get; set; }
        public decimal CrossedOutPrice { get; set; }
        public decimal DiscountRate { get; set; }
        public decimal DiscountAmount { get; set; }
        public bool HasDiscount { get; set; }
        public override string ToString()
        {
            string result = SellingPrice.ToString();

            if (HasDiscount)
            {
                result += " (au lieu de " + CrossedOutPrice.ToString() + " -" + DiscountRate + "%)";
            }

            return result;
        }

        public PriceVM(decimal sellingPrice, decimal crossedOutPrice = 0)
        {
            this.SellingPrice = sellingPrice;
            this.CrossedOutPrice = crossedOutPrice;
            this.HasDiscount = this.GetHasDiscount();
            if (HasDiscount)
            {
                this.DiscountRate = (1M - (sellingPrice / crossedOutPrice)) * 100M;
                if (this.HasDiscount)
                {
                    this.DiscountAmount = crossedOutPrice - sellingPrice;
                }
            }

        }


        private bool GetHasDiscount()
        {
            return (this.CrossedOutPrice > 0 && this.CrossedOutPrice > SellingPrice);
        }
    }
}
