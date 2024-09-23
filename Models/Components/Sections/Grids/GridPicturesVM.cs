using ConsoleMatycom.Models.Elements;

namespace ConsoleMatycom.Models.Components.Sections.Grids
{
    public class GridPicturesVM
    {
        public string _type { get; set; } = "GridPictures";
        public string Id { get; set; }
        public string Name { get; set; }
        public TitleVM TitleH2 { get; set; }
        public List<GridPicturesItemVM> Items { get; set; }
        public GridPicturesVM() 
        {
            _type = "GridPictures";
            Name = string.Empty;
            TitleH2 = new TitleVM();
            Items = new List<GridPicturesItemVM>();
        }
    }
}
