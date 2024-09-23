namespace ConsoleMatycom.Models.Navigation
{
    public class NavigationListVM
    {
        public List<NavigationListItemVM> Items { get; set; }
        public NavigationListVM()
        {
            Items = new List<NavigationListItemVM>();
        }
    }
}
