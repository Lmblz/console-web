using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ConsoleMatycom.Models.Components.Sections.Sliders
{
    public class SliderItemVM
    {
        public string Id { get; set; }
        public string Url { get; set; }
        public SliderItemImageVM Image { get; set; }
        public SliderItemContentVM Content { get; set; }

        public SliderItemVM() 
        {
            Image = new SliderItemImageVM();
            Content = new SliderItemContentVM();
        }
    }
}