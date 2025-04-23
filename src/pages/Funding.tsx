
import { useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import ContentFilter, { ContentFilters } from '@/components/ContentFilter';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, TrendingUp, Calendar } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// Mock data for funding rounds
const fundingRounds = [
  {
    id: '1',
    company: 'Anthropic',
    description: 'Building reliable, interpretable, and steerable AI systems',
    round: 'Series C',
    amount: '$450M',
    date: 'April 18, 2025',
    investors: ['Google Ventures', 'Spark Capital', 'Sequoia Capital'],
    category: 'Artificial Intelligence'
  },
  {
    id: '2',
    company: 'Rippling',
    description: 'Employee management platform for HR, IT, and Finance teams',
    round: 'Series D',
    amount: '$500M',
    date: 'April 15, 2025',
    investors: ['Greenoaks Capital', 'Coatue', 'Tiger Global'],
    category: 'HR Tech'
  },
  {
    id: '3',
    company: 'Watershed',
    description: 'Enterprise climate platform to measure, report, and reduce carbon emissions',
    round: 'Series B',
    amount: '$200M',
    date: 'April 12, 2025',
    investors: ['Sequoia Capital', 'Kleiner Perkins', 'Greenoaks Capital'],
    category: 'Climate Tech'
  },
  {
    id: '4',
    company: 'Tome',
    description: 'AI-powered storytelling platform for creators and professionals',
    round: 'Series A',
    amount: '$43M',
    date: 'April 10, 2025',
    investors: ['Lightspeed', 'Coatue', 'Greylock'],
    category: 'AI/Creativity'
  },
  {
    id: '5',
    company: 'Replit',
    description: 'Collaborative browser-based IDE and coding platform',
    round: 'Series B',
    amount: '$80M',
    date: 'April 8, 2025',
    investors: ['Andreessen Horowitz', 'Y Combinator', 'Craft Ventures'],
    category: 'Developer Tools'
  },
  {
    id: '6',
    company: 'Navan',
    description: 'All-in-one travel, corporate card, and expense management platform',
    round: 'Series G',
    amount: '$300M',
    date: 'April 5, 2025',
    investors: ['Base10 Partners', 'Elad Gil', 'Capital One Ventures'],
    category: 'FinTech'
  }
];

// Filter options
const filterCategories = [
  { id: 'ai', label: 'Artificial Intelligence' },
  { id: 'fintech', label: 'FinTech' },
  { id: 'climate-tech', label: 'Climate Tech' },
  { id: 'hr-tech', label: 'HR Tech' },
  { id: 'dev-tools', label: 'Developer Tools' }
];

const filterRounds = [
  { id: 'seed', label: 'Seed' },
  { id: 'series-a', label: 'Series A' },
  { id: 'series-b', label: 'Series B' },
  { id: 'series-c', label: 'Series C' },
  { id: 'late-stage', label: 'Late Stage (D+)' }
];

const filterRegions = [
  { id: 'north-america', label: 'North America' },
  { id: 'europe', label: 'Europe' },
  { id: 'asia-pacific', label: 'Asia Pacific' },
  { id: 'latin-america', label: 'Latin America' }
];

const filterInvestors = [
  { id: 'a16z', label: 'Andreessen Horowitz' },
  { id: 'sequoia', label: 'Sequoia Capital' },
  { id: 'accel', label: 'Accel' },
  { id: 'ggv', label: 'GGV Capital' },
  { id: 'tiger', label: 'Tiger Global' }
];

const Funding = () => {
  const [filters, setFilters] = useState<ContentFilters>({
    search: '',
    categories: [],
    regions: [],
    fundingStages: [],
    tags: []
  });

  return (
    <PageTemplate>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Funding Rounds</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Track the latest investment activity in the tech startup ecosystem.
          </p>
        </div>

        {/* Funding Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Total Funding (Apr)</p>
                <h3 className="text-2xl font-bold">$1.57B</h3>
              </div>
              <div className="p-2 bg-green-100 rounded-full dark:bg-green-900/20">
                <ArrowUp className="h-4 w-4 text-green-600 dark:text-green-500" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-500 mr-1" />
              <span className="text-xs text-green-600 dark:text-green-500">12% from Mar</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Avg Deal Size</p>
                <h3 className="text-2xl font-bold">$86.7M</h3>
              </div>
              <div className="p-2 bg-green-100 rounded-full dark:bg-green-900/20">
                <ArrowUp className="h-4 w-4 text-green-600 dark:text-green-500" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-500 mr-1" />
              <span className="text-xs text-green-600 dark:text-green-500">5.2% from Mar</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Deal Count</p>
                <h3 className="text-2xl font-bold">42</h3>
              </div>
              <div className="p-2 bg-red-100 rounded-full dark:bg-red-900/20">
                <ArrowDown className="h-4 w-4 text-red-600 dark:text-red-500" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <ArrowDown className="h-3 w-3 text-red-600 dark:text-red-500 mr-1" />
              <span className="text-xs text-red-600 dark:text-red-500">3% from Mar</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Top Sector</p>
                <h3 className="text-xl font-bold">AI & ML</h3>
              </div>
              <div className="p-2 bg-parrot-soft-green rounded-full dark:bg-parrot-green/20">
                <Calendar className="h-4 w-4 text-parrot-green" />
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              38% of total funding
            </div>
          </div>
        </div>

        <ContentFilter
          categories={filterCategories}
          regions={filterRegions}
          fundingStages={filterRounds}
          tags={filterInvestors}
          onFilterChange={setFilters}
        />

        <div className="mt-6 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Company</TableHead>
                <TableHead>Round & Amount</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden md:table-cell">Key Investors</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fundingRounds.map(round => (
                <TableRow key={round.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{round.company}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{round.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-parrot-green">{round.round}</div>
                    <div className="text-sm font-semibold">{round.amount}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{round.date}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline" className="bg-parrot-soft-green/20 border-parrot-green text-xs">
                      {round.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {round.investors.slice(0, 2).map((investor, idx) => (
                        <span key={idx} className="text-xs text-gray-600 dark:text-gray-400">
                          {investor}{idx < Math.min(round.investors.length, 2) - 1 ? ',' : ''}
                        </span>
                      ))}
                      {round.investors.length > 2 && (
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          +{round.investors.length - 2} more
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-8 flex justify-center">
          <Button variant="outline" className="border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">
            Load More
          </Button>
        </div>
      </div>
    </PageTemplate>
  );
};

export default Funding;
