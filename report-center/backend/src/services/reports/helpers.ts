export function agruparPor<T>(arr: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const k = keyFn(item);
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

export function soloHora(isoStr: string): string {
  if (!isoStr) return '-';
  const d = new Date(isoStr);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

export function soloDia(isoStr: string): string {
  if (!isoStr) return '-';
  const parte = String(isoStr).substring(0, 10);
  const parts = parte.split('-');
  if (parts.length !== 3) return '-';
  const [anio, mes, dia] = parts;
  return `${dia}/${mes}/${anio}`;
}

export function calculateNextExecution(reportTime: string, daysOfWeek?: number[], timezone: string = 'America/Lima'): string {
  const now = new Date();
  
  // Parse configured times
  const times = (reportTime || '08:00').split(',').map(t => {
    const parts = t.trim().split(':');
    return {
      hour: parseInt(parts[0], 10) || 0,
      minute: parseInt(parts[1], 10) || 0
    };
  });

  const activeDays = daysOfWeek && daysOfWeek.length > 0 ? daysOfWeek : [0, 1, 2, 3, 4, 5, 6];

  let earliestNext: Date | null = null;

  // Let's test the next 14 days to find the nearest matching timestamp
  for (let offsetDays = 0; offsetDays <= 14; offsetDays++) {
    const testDate = new Date(Date.now() + offsetDays * 24 * 60 * 60 * 1000);
    
    // Get the date elements in Lima timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
    
    let formattedStr = '';
    try {
      formattedStr = formatter.format(testDate);
    } catch (e) {
      formattedStr = `${testDate.getMonth() + 1}/${testDate.getDate()}/${testDate.getFullYear()}`;
    }
    const dayVal = new Date(formattedStr).getDay(); // 0-6

    if (!activeDays.includes(dayVal)) {
      continue;
    }

    for (const t of times) {
      // Build candidate date in Lima timezone
      const candidate = new Date(formattedStr);
      candidate.setHours(t.hour, t.minute, 0, 0);

      // Now convert candidate back to UTC and compare
      if (candidate.getTime() > now.getTime()) {
        if (!earliestNext || candidate.getTime() < earliestNext.getTime()) {
          earliestNext = candidate;
        }
      }
    }
  }

  return earliestNext ? earliestNext.toISOString() : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
}
