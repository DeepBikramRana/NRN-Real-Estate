import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true',
        furnished: furnishedFromUrl === 'true',
        offer: offerFromUrl === 'true',
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      setShowMore(data.length > 8);
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value, checked } = e.target;
    if (id === 'searchTerm') return setSidebardata({ ...sidebardata, searchTerm: value });
    if (id === 'sort_order') {
      const [sort, order] = value.split('_');
      return setSidebardata({ ...sidebardata, sort, order });
    }
    if (['all', 'rent', 'sale'].includes(id)) return setSidebardata({ ...sidebardata, type: id });
    setSidebardata({ ...sidebardata, [id]: checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(sidebardata);
    navigate(`/search?${urlParams.toString()}`);
  };

  const onShowMoreClick = async () => {
    const startIndex = listings.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const res = await fetch(`/api/listing/get?${urlParams.toString()}`);
    const data = await res.json();
    if (data.length < 9) setShowMore(false);
    setListings([...listings, ...data]);
  };

  return (
    <div className='flex flex-col md:flex-row min-h-screen bg-gray-50'>
      <aside className='w-full md:w-80 p-6 bg-white border-r shadow-md'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Search Term</label>
            <input
              type='text'
              id='searchTerm'
              className='w-full border rounded-md px-4 py-2 shadow-sm focus:ring focus:ring-blue-200'
              placeholder='Search...'
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Type</label>
            <div className='space-y-2'>
              {['all', 'rent', 'sale'].map((type) => (
                <div key={type} className='flex items-center gap-2'>
                  <input
                    type='radio'
                    id={type}
                    name='type'
                    checked={sidebardata.type === type}
                    onChange={handleChange}
                    className='h-4 w-4 text-blue-600'
                  />
                  <label htmlFor={type} className='text-sm text-gray-700 capitalize'>{type}</label>
                </div>
              ))}
              <div className='flex items-center gap-2'>
                <input type='checkbox' id='offer' checked={sidebardata.offer} onChange={handleChange} className='h-4 w-4 text-blue-600' />
                <label htmlFor='offer' className='text-sm text-gray-700'>Offer</label>
              </div>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Amenities</label>
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <input type='checkbox' id='parking' checked={sidebardata.parking} onChange={handleChange} className='h-4 w-4 text-blue-600' />
                <label htmlFor='parking' className='text-sm text-gray-700'>Parking</label>
              </div>
              <div className='flex items-center gap-2'>
                <input type='checkbox' id='furnished' checked={sidebardata.furnished} onChange={handleChange} className='h-4 w-4 text-blue-600' />
                <label htmlFor='furnished' className='text-sm text-gray-700'>Furnished</label>
              </div>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Sort by</label>
            <select
              id='sort_order'
              onChange={handleChange}
              defaultValue='created_at_desc'
              className='w-full border rounded-md px-4 py-2 shadow-sm focus:ring focus:ring-blue-200'
            >
              <option value='regularPrice_desc'>Price high to low</option>
              <option value='regularPrice_asc'>Price low to high</option>
              <option value='createdAt_desc'>Latest</option>
              <option value='createdAt_asc'>Oldest</option>
            </select>
          </div>

          <button type='submit' className='w-full bg-blue-600 text-white py-2 rounded-md shadow hover:bg-blue-700 transition duration-200'>Search</button>
        </form>
      </aside>

      <main className='flex-1 p-6'>
        <h1 className='text-2xl font-semibold text-gray-800 mb-4'>Listing Results</h1>

        {loading ? (
          <p className='text-gray-600'>Loading...</p>
        ) : listings.length === 0 ? (
          <p className='text-gray-600'>No listing found!</p>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
          </div>
        )}

        {showMore && (
          <div className='flex justify-center mt-6'>
            <button
              onClick={onShowMoreClick}
              className='text-blue-600 hover:underline font-medium'
            >
              Show More
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
