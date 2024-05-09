export const getMembersViewsReadsChartData = (data) => {
  const memberViewsReadsData = {};
  Object.keys(data).map((key) => {
    const post = data[key];
    const membersOnly = post.filter(bucket => bucket.membershipType === 'MEMBER');

    membersOnly.forEach(bucket => {
      const timestamp = bucket.dayStartsAt;
      if (!memberViewsReadsData[timestamp]) {
        memberViewsReadsData[timestamp] = {
          timestamp,
          views: 0,
          reads: 0,
        }
      }
      memberViewsReadsData[timestamp].views += bucket.readersThatViewedCount;
      memberViewsReadsData[timestamp].reads += bucket.readersThatReadCount;
    })
  });

  return Object.values(memberViewsReadsData).sort((a, b) => a.timestamp - b.timestamp)
}

export const getEngagementMetric = (data, metricKey) => {
  if (!data || !metricKey) {
    return []
  }

  const total = {};
  Object.keys(data).map((key) => {
    const post = data[key];
    post.forEach(bucket => {
      const timestamp = bucket.dayStartsAt;
      if (!total[timestamp]) {
        total[timestamp] = {
          timestamp,
          member: 0,
          nonMember: 0,
        }
      }
      total[timestamp].member += bucket.membershipType === 'MEMBER' ? bucket[metricKey] : 0;
      total[timestamp].nonMember += bucket.membershipType === 'NONMEMBER' ? bucket[metricKey] : 0;
    })
  })

  return Object.values(total).sort((a, b) => a.timestamp - b.timestamp)
}
