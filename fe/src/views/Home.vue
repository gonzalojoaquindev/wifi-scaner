<template>
  <v-container>
    <NavbarS />
    <template>
      <v-btn text class="mx-2" dark color="indigo" @click="add()">
        <v-icon dark> mdi-content-save </v-icon>
        Guardar
      </v-btn>
      <v-btn class="mx-2" dark color="indigo" @click="read()">
        <v-icon dark> mdi-access-point </v-icon>
        Escanear
      </v-btn>
      <v-btn class="mx-2" dark color="indigo" @click="prueba()">
        <v-icon dark> mdi-play </v-icon>
        Prueba
      </v-btn>
      {{ scanToAdd.date }}

      <v-data-table
        :headers="headers"
        :items="scanList"
        class="elevation-1"
        dense
        sort-by="rssi"
        sort-desc
        selectable-key
        multi-sort
      >
        <template v-slot:item.rssi="{ item }">
          <v-chip :color="getColor(item.rssi)" dark>
            {{ item.rssi }}
          </v-chip>
        </template>
      </v-data-table>
    </template></v-container
  >
</template>


<script>
import NavbarS from "@/components/NavbarS";
export default {
  data: () => ({
    ap: {
      name: "M1-RAP-01",
      mac: "1321ad21a",
    },
    scanToAdd: {
      date: new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      ).toISOString(),
    },
    scanList: [],
    pruebas: [],
    headers: [
      { text: "SSID", value: "ssid" },
      { text: "NOMBRE", value: "name" },
      { text: "RSSI", value: "rssi" },
      { text: "CANAL", value: "channel" },
      { text: "MAC", value: "mac" },
    ],
  }),
  components: {
    NavbarS,
  },
  methods: {
    getColor(rssi) {
      if (rssi > -50) return "green";
      else if (rssi > -55) return "lime";
      else if (rssi > -60) return "amber";
      else if (rssi > -65) return "orange";
      else if (rssi > -70) return "deep-orange";
      else return "red";
    },
    async read() {
      try {
        console.log("leyendo");
        const res = await this.axios.get(`/ap/read`);
        console.log("res: ", res);
        this.scanList = res.data.scan;
        console.log("scanList: ", this.scanList);
      } catch (error) {
        console.log(error);
      }
    },
    async prueba() {
      try {
        console.log("leyendo base de datos");
        const res = await this.axios.post(`/ap/prueba`, this.scanToAdd);
        console.log("respuesta: ", res);
        this.scanList = res.data.lastScan;
        /*   this.scanList.push(res.data.scan); */
        console.log("Escaneo: ", this.scanList);
      } catch (error) {
        console.log("Error: ", error);
      }
    },

    async add() {
      /*  this.pm03ToAdd.create_by_id = this.user.id;
      console.log(this.pm03ToAdd); */
      try {
        this.scanToAdd.date = new Date(
          Date.now() - new Date().getTimezoneOffset() * 60000
        ).toISOString();
        console.log("intentando escanear");
        const res = await this.axios.post("/ap/create", this.scanToAdd);
        console.log("Guardado");
        this.prueba();

        /*  const res = await this.axios.post("/pm03/create", this.pm03ToAdd);
        
        this.pm03List.push(res.data.pm03);
        this.$refs.addForm.reset();
        this.add = false;
        this.alert = {
          show: true,
          type: "success",
          message: res.data.message,
        }; */

        console.log("aprobo");
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

 <style scoped>
/* .carousel {
  width: 100vw;
} */
</style> 