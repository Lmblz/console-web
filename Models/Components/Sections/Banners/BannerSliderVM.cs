using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ConsoleMatycom.Models.Components.Sections.Banners
{
    public class BannerSliderVM
    {
        public string _type { get; set; }
        public string Id { get; set; }
        public string Name { get; set; }
        public List<BannerSliderItemVM> Items { get; set; }
        public int AutoplayTimeout { get; set; } = 3000;
        public BannerSliderVM()
        {
            this._type = "BannerSlider";
            AutoplayTimeout = 3000;
        }

        public override string ToString()
        {
            return this.Id + " - " + (this.Name ?? string.Empty) + (this.Items!=null ? " (Items: " + this.Items.Count + ")" : string.Empty);
        }
    }
}