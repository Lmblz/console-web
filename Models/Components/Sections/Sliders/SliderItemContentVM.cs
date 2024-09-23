using ConsoleMatycom.Models.Elements;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ConsoleMatycom.Models.Components.Sections.Sliders
{
    public class SliderItemContentVM
    {
        public TitleVM Title { get; set; }
        public DescriptionVM Description { get; set; }
        public ButtonVM Button { get; set; }
        public SliderItemContentVM()
        {
            Title = new TitleVM();
            Description = new DescriptionVM();
            Button = new ButtonVM()
            {
                Class = "button -link -underline"
            };
        }
    }
}