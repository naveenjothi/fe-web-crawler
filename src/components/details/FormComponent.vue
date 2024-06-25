<template>
  <div class="d-flex flex-column w-100 justify-content-between h-100 my-2">
    <div class="w-50">
      <InputComponent
        label="Company Name"
        id="companyName"
        v-model="data.companyName"
      />
    </div>
    <div class="w-50 d-flex gap-2">
      <InputComponent
        label="CIN"
        wrapper-class="w-50"
        id="cin"
        :disabled="componentType == 'edit'"
        v-model="data.cin"
      />
      <InputComponent
        label="ROC"
        wrapper-class="w-50"
        type="number"
        id="roC"
        v-model="data.roC"
      />
    </div>

    <div class="w-50 d-flex gap-2">
      <InputComponent
        label="Category"
        wrapper-class="w-50"
        id="category"
        v-model="data.category"
      />
      <InputComponent
        label="Sub Category"
        id="subCategory"
        wrapper-class="w-50"
        v-model="data.subCategory"
      />
    </div>
    <div class="w-50 d-flex gap-2">
      <InputComponent
        label="Address"
        id="address"
        v-model="data.address"
        wrapper-class="w-75"
      />
      <InputComponent
        label="Pin Code"
        wrapper-class="w-25"
        type="number"
        id="pinCode"
        v-model="data.pinCode"
      />
    </div>
    <div class="w-50 d-flex gap-2">
      <InputComponent
        label="State"
        wrapper-class="w-50"
        id="state"
        v-model="data.state"
      />
      <InputComponent
        label="Country"
        id="country"
        wrapper-class="w-50"
        v-model="data.country"
      />
    </div>
    <div class="w-50">
      <InputComponent label="Managed By" id="email" v-model="data.email" />
    </div>
    <div class="w-50 d-flex gap-2">
      <InputComponent
        label="Authorized Capital"
        wrapper-class="w-50"
        type="number"
        id="authorisedCapital"
        v-model="data.authorisedCapital"
      />
      <InputComponent
        label="Paidup Capital"
        id="paidUpCapital"
        type="number"
        wrapper-class="w-50"
        v-model="data.paidUpCapital"
      />
    </div>
    <div class="w-50 d-flex gap-2">
      <InputComponent
        label="Company Class"
        id="companyClass"
        wrapper-class="w-50"
        v-model="data.companyClass"
      />
      <InputComponent
        label="Registration Date"
        id="registrationDate"
        type="number"
        wrapper-class="w-50"
        v-model="data.registrationDate"
      />
    </div>
    <div class="w-50 d-flex justify-content-end">
      <ButtonComponent class="w-25 rounded" @click.prevent="handleSave"
        >Save</ButtonComponent
      >
    </div>
  </div>
</template>
<script lang="ts" setup>
import { PropType, defineComponent, toRefs } from "vue";
import { IClient } from "../../models/client.model";
import InputComponent from "../InputComponent.vue";
import ButtonComponent from "../ButtonComponent.vue";
import axios from "axios";
import { useRoute } from "vue-router";

defineComponent([InputComponent, ButtonComponent]);

const emit = defineEmits(["on-success"]);

const route = useRoute();

const props = defineProps({
  data: {
    type: Object as PropType<IClient>,
    default: {
      companyName: "",
      cin: "",
      companyClass: "",
      category: "",
      subCategory: "",
      address: "",
      state: "",
      country: "",
      email: "",
      authorisedCapital: 0,
      paidUpCapital: 0,
      roC: "",
      companyStatus: "",
      companyActivity: "",
      registrationDate: "",
      pinCode: "",
    },
  },
  componentType: {
    type: String,
    required: true,
    default: "add",
  },
});

const { data, componentType } = toRefs(props);

const handleSave = async () => {
  const itemId = route.params.id as string;
  const payload = { ...data.value };
  if (componentType.value == "edit") {
    delete payload.id;
    await axios.post(`/api/clients/${itemId}`, { input: payload });
  } else {
    await axios.post(`/api/clients/`, { input: payload });
  }
  emit("on-success");
};
</script>
