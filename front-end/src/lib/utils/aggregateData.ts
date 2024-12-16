import { IChartDataPosts, IChartDataUsers } from "@/services/admin/dashboardService";

// Utility function to aggregate by month or year
export default function aggregateData({ 
    data, 
    groupBy,
    dataType 
}: {
    data: IChartDataUsers[] | IChartDataPosts[]; 
    groupBy: 'Month' | 'Year' | 'Day';
    dataType:'users' |'posts'; 
}) {

    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // Check for empty or null data
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    // Reduce data based on grouping criteria (month or year)
    const aggregatedData = data?.reduce((acc, item) => {
        if (!item._id) return acc; 
        const date = new Date(item._id); // Convert _id to Date object
        let groupKey: string = ''

        if (groupBy === 'Month') {
            // Group by month name (e.g., "Jan", "Feb")
            groupKey = monthNames[date.getMonth()];
        } else if(groupBy === 'Year') {
            // Group by year (e.g., "2024", "2025")
            groupKey = date.getFullYear().toString();
        }else if(groupBy === 'Day'){
            groupKey = date.toISOString().split('T')[0]
        }

        let value = 0;
        if(dataType === 'posts' && 'posts' in item){
            value = item?.posts
        }else if(dataType === 'users' && 'users' in item){
            value = item?.users
        }

         // If the group already exists, increment the value; otherwise, initialize it
    if (acc[groupKey]) {
        acc[groupKey] += value;
      } else {
        acc[groupKey] = value;
      }

        return acc;
    }, {} as Record<string, number>);
    
    // Convert the accumulator to an array to maintain consistency of the output format
   return Object.keys(aggregatedData).map(group => ({
    _id: group,
    ...(dataType === 'users' ? { users: aggregatedData[group] } : { posts: aggregatedData[group] }) // Dynamically add 'users' or 'posts'
} as IChartDataUsers | IChartDataPosts));
} 
    
    
