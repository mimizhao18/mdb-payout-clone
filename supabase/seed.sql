-- SAMPLE settlements for development. These are placeholders: replace them with
-- real settlements, and set claim_url to each settlement's official claim site.
-- due_date is relative to the day this runs.

insert into public.settlements
  (slug, company, brand, title, amount_label, headline, estimated_payout, due_date, tag, category, summary, description, is_featured, claims_filed, claims_total)
values
  ('tyson-chicken', 'Tyson Foods', null, 'Tyson Chicken Price-Fixing Settlement', '$20-$50', 'claim between $20 and $50', 35, current_date + 5, 'no_proof', 'Upcoming',
   'You may be eligible if you bought Tyson chicken products in the past 6 years.',
   'Eligible purchasers can claim a flat payment without receipts.', true, 1274, 12000),
  ('doordash-delivery-fees', 'DoorDash', null, 'DoorDash Delivery Fee Settlement', '$15-$40', 'claim between $15 and $40', 27.5, current_date + 9, 'uncapped', 'Upcoming',
   'Customers charged certain delivery fees may be eligible for a payment.',
   'Orders placed during the class period that included the covered fee qualify.', true, 3820, 9000),
  ('bartz-anthropic', 'Stolen Books', null, 'Bartz v. Anthropic – Copyright Settlement', '$3000+', 'claim at least $3,000', 3000, current_date + 28, 'no_proof', 'Upcoming',
   'You may get a cut of a $1500M settlement over pro rata payments from a $1.5b fund for rightsholders of books on the anthropic works list (≈ $3,000/work before costs).',
   'Authors and publishers whose books were used without permission can file a claim. Payments are split pro rata across all valid claims.', false, 0, 0),
  ('instagram-addiction', 'Instagram', 'instagram', 'Instagram Social Media Addiction Arbitration Claims', '$1000+', 'claim at least $1,000', 1000, current_date + 576, 'uncapped', 'Privacy',
   'You may get a cut of a $1M settlement over potential arbitration claims for harms from an allegedly addictive design.',
   'Users who experienced harm tied to heavy platform use may be able to pursue an individual arbitration claim and receive a share of the settlement.', false, 0, 0),
  ('doordash-hidden-fees', 'DoorDash', null, 'DoorDash Hidden Fees Settlement', '$1000', 'claim up to $1,000', 25, current_date + 576, 'uncapped', 'False Ads',
   'Customers who were charged undisclosed service fees may claim a refund.',
   'Orders in the covered period that included a fee not shown at checkout qualify.', false, 0, 0),
  ('microsoft-ads', 'Microsoft', null, 'Microsoft Advertising Practices Settlement', '$500+', 'claim at least $500', 50, current_date + 576, 'uncapped', 'Overbilling',
   'Account holders affected by misleading ad targeting may claim a payment.',
   'Anyone with an eligible account during the class period can file.', false, 0, 0),
  ('apple-data-breach', 'Apple', 'apple', 'Apple Data Breach Settlement', '$25-$100', 'claim between $25 and $100', 60, current_date + 30, 'no_proof', 'Privacy',
   'Users whose account data was exposed may be eligible for a payment.',
   'Account holders notified of the incident can claim without proof of loss.', false, 0, 0),
  ('facebook-retail', 'Meta', 'meta', 'Facebook Retail Settlement', '$30+', 'claim at least $30', 30, current_date + 90, 'no_proof', 'Privacy',
   'Users in the affected class may claim a share of the fund.',
   'Eligible users can file a claim online without receipts.', false, 0, 0),
  ('tesla-emissions', 'Tesla', 'tesla', 'Tesla Emissions Settlement', '$100+', 'claim at least $100', 100, current_date + 120, 'uncapped', 'False Ads',
   'Owners of affected vehicles may be eligible for compensation.',
   'Payment amounts depend on the number of valid claims.', false, 0, 0),
  ('fortnite-refunds', 'Epic Games', 'fortnite', 'Fortnite Refund Program', '$50-$150', 'claim between $50 and $150', 80, current_date + 60, 'no_proof', 'False Ads',
   'Players who made certain in-game purchases may be eligible for a refund.',
   'Eligible players can submit a refund request through the program website.', false, 0, 0),
  ('google-privacy', 'Google', 'google', 'Google Privacy Settlement', '$10-$60', 'claim between $10 and $60', 30, current_date + 45, 'no_proof', 'Privacy',
   'Users affected by the alleged privacy practices may claim a payment.',
   'Eligible users can file online; no receipts are required.', false, 0, 0)
on conflict (slug) do nothing;
