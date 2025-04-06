import React from 'react';
import { Card, Table, Badge } from 'react-bootstrap';
import StatusBadge from './components/StatusBadge';

const CountryStatus = () => {
  const effectiveMembers = [
    { country: 'Angola', status: 'Active', since: '2015', tier: 'Full', payment: 'Current', rep: 'José Eduardo' },
    { country: 'South Africa', status: 'Active', since: '2010', tier: 'Founding', payment: 'Current', rep: 'Naledi Pandor' },
    { country: 'Zimbabwe', status: 'Active', since: '2013', tier: 'Full', payment: 'Current', rep: 'Frederick Shava' },
    { country: 'Namibia', status: 'Active', since: '2012', tier: 'Full', payment: 'Current', rep: 'Netumbo Nandi-Ndaitwah' },
    { country: 'Tanzania', status: 'Active', since: '2014', tier: 'Full', payment: 'Current', rep: 'Liberata Mulamula' },
    { country: 'Ghana', status: 'Active', since: '2011', tier: 'Full', payment: 'Current', rep: 'Shirley Ayorkor Botchwey' },
    { country: 'Guinea', status: 'Active', since: '2017', tier: 'Full', payment: 'Pending', rep: 'Mamadi Touré' },
    { country: 'DRC', status: 'Active', since: '2016', tier: 'Full', payment: 'Current', rep: 'Christophe Lutundula' },
    { country: 'Congo', status: 'Active', since: '2018', tier: 'Associate', payment: 'Current', rep: 'Jean-Claude Gakosso' },
    { country: 'Togo', status: 'Active', since: '2019', tier: 'Associate', payment: 'Current', rep: 'Robert Dussey' },
    { country: 'Central African Republic', status: 'Active', since: '2020', tier: 'Associate', payment: 'Pending', rep: 'Sylvie Baïpo-Temon' },
    { country: 'Cameroon', status: 'Active', since: '2015', tier: 'Full', payment: 'Current', rep: 'Mokuy' },
    { country: 'Côte d\'Ivoire', status: 'Active', since: '2017', tier: 'Full', payment: 'Current', rep: 'Kandia Camara' },
    { country: 'Sierra Leone', status: 'Active', since: '2018', tier: 'Associate', payment: 'Current', rep: 'David Francis' },
    { country: 'Liberia', status: 'Active', since: '2019', tier: 'Associate', payment: 'Pending', rep: 'Dee-Maxwell Kemayah' }
  ];

  const observerMembers = [
    { country: 'Gabon', status: 'Observer', since: '2021', tier: 'Observer', payment: 'N/A', rep: 'Michael Moussa' },
    { country: 'Algeria', status: 'Observer', since: '2020', tier: 'Observer', payment: 'N/A', rep: 'Ramtane Lamamra' },
    { country: 'Mali', status: 'Observer', since: '2022', tier: 'Observer', payment: 'N/A', rep: 'Abdoulaye Diop' },
    { country: 'Mozambique', status: 'Observer', since: '2021', tier: 'Observer', payment: 'N/A', rep: 'Verónica Macamo' },
    { country: 'Russia', status: 'Observer', since: '2019', tier: 'Observer', payment: 'N/A', rep: 'Sergey Lavrov' }
  ];

  return (
    <Card className="mb-4">
      <Card.Header>
        <h5>Member Status by Country</h5>
      </Card.Header>
      <Card.Body>
        <h6 className="mb-3 text-primary">Effective Members (15)</h6>
        <Table striped hover responsive className="mb-5">
          <thead>
            <tr>
              <th>Country</th>
              <th>Status</th>
              <th>Member Since</th>
              <th>Tier</th>
              <th>Payment Status</th>
              <th>Representative</th>
            </tr>
          </thead>
          <tbody>
            {effectiveMembers.map((country, index) => (
              <tr key={`effective-${index}`}>
                <td>{country.country}</td>
                <td>
                  <StatusBadge status={country.status} />
                </td>
                <td>{country.since}</td>
                <td>{country.tier}</td>
                <td>
                  <Badge variant={country.payment === 'Current' ? 'success' : 'warning'}>
                    {country.payment}
                  </Badge>
                </td>
                <td>{country.rep}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <h6 className="mb-3 text-secondary">Observer Members (5)</h6>
        <Table striped hover responsive>
          <thead>
            <tr>
              <th>Country</th>
              <th>Status</th>
              <th>Observer Since</th>
              <th>Tier</th>
              <th>Representative</th>
            </tr>
          </thead>
          <tbody>
            {observerMembers.map((country, index) => (
              <tr key={`observer-${index}`}>
                <td>{country.country}</td>
                <td>
                  <StatusBadge status={country.status} />
                </td>
                <td>{country.since}</td>
                <td>{country.tier}</td>
                <td>{country.rep}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default CountryStatus;