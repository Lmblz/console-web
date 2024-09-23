using ConsoleMatycom.Models.Components.Sections.Images;
using ConsoleMatycom.Models.Elements;

namespace ConsoleMatycom.Models.Components.Sections.Others
{
    public class SimpleSectionVM
    {
        public string _type { get; set; }
        public int Id { get; set; }
        public string Name { get; set; }
        public TitleVM? TitleH2 { get; set; }
        public TitleVM? TitleH3 { get; set; }
        public DescriptionVM? Description {  get; set; }
        public ResponsivePictureVM? Picture { get; set; }
        public SimpleSectionVM() 
        {
            _type = "SimpleSection";
        }
    }
}
