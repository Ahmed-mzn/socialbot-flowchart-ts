<template>
    <div>
        <textarea
            class="dark-input"
            :value="value"
            :placeholder="name"
            @input="$emit('input', $event.target.value)"
        />
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class TextareaOption extends Vue {
    @Prop({ type: String, default: "" })
    value!: string;

    @Prop({ type: String })
    name!: string;
}
</script>