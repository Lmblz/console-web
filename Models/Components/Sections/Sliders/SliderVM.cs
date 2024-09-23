using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ConsoleMatycom.Models.Components.Sections.Sliders
{
    public class SliderVM 
    {
        public string _type { get; set; }
        public int Id { get; set; }
        public string Name { get; set; }
        public int SizeItems { get; set; }
        public List<SliderItemVM> Items { get; set; }

        public bool IsInstaSlider { get; set; }

        public SliderVM()
        {
            this._type = "Slider";
            SizeItems = 300;
            Items = new List<SliderItemVM>();
            IsInstaSlider = false;
        }
    }
}