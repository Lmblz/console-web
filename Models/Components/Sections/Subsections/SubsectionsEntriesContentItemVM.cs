using ConsoleMatycom.Models.Components.Sections.Images;

namespace ConsoleMatycom.Models.Components.Sections.Subsections
{
    public class SubsectionsEntriesContentItemVM
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string EncodedUrl { get; set; }
        public string Url { get; set; }
        public ResponsivePictureVM Picture { get; set; }
        public SubsectionsEntriesContentItemVM() { }
    }
}