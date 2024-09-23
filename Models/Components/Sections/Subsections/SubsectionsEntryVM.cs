namespace ConsoleMatycom.Models.Components.Sections.Subsections
{
    public class SubsectionsEntryVM
    {
        public string Id { get; set; }

        public int SubsectionId { get; set; }

        public bool IsActive { get; set; }
        public SubsectionsEntriesTitleVM Title { get; set; }

        public SubsectionsEntriesContentVM Content { get; set; }

        public SubsectionsEntryVM() { }
    }
}