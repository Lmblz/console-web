using ConsoleMatycom.Models.Components.Sections.Cards;
using ConsoleMatycom.Models.Components.Sections.Sliders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ConsoleMatycom.Models.Components.Sections.CardsSlider
{
    public class CardsSliderVM
    {
        public string _type { get; set; }
        public string Id { get; set; }
        public string Name { get; set; }
        public SliderAreaVM Slider { get; set; }
        public SwipeCardsVM Cards { get; set; }

        public CardsSliderVM()
        {
            this._type = "CardsSlider";
            Slider = new SliderAreaVM();
            Cards = new SwipeCardsVM();
        }
    }
}