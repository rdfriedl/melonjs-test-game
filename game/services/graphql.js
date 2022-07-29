export async function makeRequest(url = '', query = '{}', variables = {}){
	return await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		},
		body: JSON.stringify({query, variables})
	})
  .then(r => r.json())
}
