namespace ConsoleMatycom.Models.Navigation
{
    public class NavigationListItemVM
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public DateTime DatePublish { get; set; }
        public DateTime DateDelete { get; set; }

        public NavigationListItemVM()
        {
            Id = String.Empty;
            Title = String.Empty;
            DatePublish = new DateTime();
            DateDelete = new DateTime();
        }

        public NavigationListItemVM(NavigationVM navigationVM)
        {
            Id = navigationVM.Id;
            Title = navigationVM.Title;
            DatePublish = navigationVM.DatePublish;
            DateDelete = navigationVM.DateDelete;
        }
    }
}
