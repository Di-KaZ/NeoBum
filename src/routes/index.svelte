<script lang="ts">
	import { Button } from 'attractions';
	import { Albums } from '../services/Models/Albums';

	let result;
	const test = async () => {
		result = await Albums.createOne({
			name: 'GET_MOUSSED',
			prodYear: 2021,
			price: 13.5,
			coverUrl: ''
		});
		console.log(result);
		result = result.name;
	};
</script>

<Button outline on:click={test}>Hey</Button>
{result}
