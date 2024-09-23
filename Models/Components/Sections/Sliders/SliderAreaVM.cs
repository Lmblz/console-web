using ConsoleMatycom.Models.Elements;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ConsoleMatycom.Models.Components.Sections.Sliders
{
    public class SliderAreaVM
    {
        public string _type { get; set; }
        public int Id { get; set; }
        public string Name { get; set; }
        public TitleVM TitleH1 { get; set; }
        public TitleVM TitleH2 { get; set; }
        public TitleVM TitleH3 { get; set; }
        public string Logo { get; set; }
        public SliderVM Slider { get; set; }

        public SliderAreaVM()
        {
            _type = "SliderArea";
            TitleH1 = new TitleVM();
            TitleH2 = new TitleVM();
            TitleH3 = new TitleVM();
        }
    }
}