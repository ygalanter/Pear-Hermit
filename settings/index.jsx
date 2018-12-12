
const colorPickerColors = ["#a2e4fd", "#31baff", "#0074fc", "#0000ff", "#b8b7fb", "#6685ff",
                           "#0051fc", "#0000bf", "#d9b7fa", "#9874fc", "#6839ff", "#431cbf", "blue", 
                           "#f9b6f9", "#fa73fa", "#da00cf", "#960086", "#faa3c0", "#fb5598", "magenta",
                           "#e70056", "#aa001a", "#f1d1ae", "#fb7853", "#fa3500", "#aa0c00", "red",
                           "#fde1a5", "#fea037", "#e75c00", "#8a1300", "#f9da71", "#fab900", "yellow",
                           "#ad7d00", "#503000", "#d7fa6f", "#b6fa00", "#00b900", "#007900", "green",
                           "#b6f9b5", "#51d94b", "#00aa00", "#006a00", "#b6f9d8", "#4ffa94", "cyan", 
                           "#00aa3e", "#005900", "#00fcfd", "#00e8d8", "#008888", "#003f59",
                           "#000000", "#585858", "#7c7c7c", "#9f9f9f", "#dadada", "#ffffff"
                          ];
const colors = colorPickerColors.map((color) => ({ color }));
class MySettings extends SettingsComponent {
  renderCollapsable({ key, label, content }) {
    const {
      settings: {
        [key]: openSetting = 'false'
      },
      settingsStorage
    } = this.props;
    const isOpen = JSON.parse(openSetting);
    return [
      <Button
        list
        label={ <Text bold align="left">{ isOpen ? '▼' : '►' }{'\u0009'}{label}</Text> }
        onClick={() => settingsStorage.setItem(key, isOpen ? 'false' : 'true') } />,
      isOpen && content
    ];
  }
  renderColorSelect({ title, settingsKey }) {
    return [
      <ColorSelect settingsKey={settingsKey} colors={colors} />
    ];
  }
  
  renderSlider({label, settingsKey, min, max}) {
    return [
      <Slider label={label} settingsKey={settingsKey} min={min} max={max} />
    ]
  }
  
  renderURL({label,settingsKey,URL}) {
    return [
      <TextInput label={label} settingsKey={settingsKey} name={settingsKey}/>
    ]
  }
render() {
    return (
   <Page>
      <Section
        title={<Text bold align="center">Pear Hermit settings</Text>}>
        
          <Section>
            { this.renderCollapsable({
              key: 'backgroundColorSelection',
              label: 'Background Color',
              content: [
                this.renderColorSelect({
                  settingsKey: 'background_color'
                })
              ]
            })}
        </Section>
        
     <Section>
            { this.renderCollapsable({
              key: 'dialColorSelection',
              label: 'Dial Color',
              content: [
                this.renderColorSelect({
                  settingsKey: 'dial_color'
                })
              ]
            })}
        </Section>
        
         <Section>
            { this.renderCollapsable({
              key: 'handsLineColorSelection',
              label: 'Minute/Hour Hands Color',
              content: [
                this.renderColorSelect({
                  settingsKey: 'hands_color'
                })
              ]
            })}
        </Section>
        
        
         <Select
                label={`Digital display`}
                settingsKey="activity"
                options={[
                  {name:"Step Count", value:"steps"},
                  {name:"Time Active", value:"activeMinutes"},
                  {name:"Calories Burned", value:"calories"},
                  {name:"Distance Walked", value:"distance"},
                  {name:"Floors Climbed", value:"elevationGain"},
                  {name:"Heart Rate", value:"heartRate"},        
                  {name:"Battery Charge", value:"battery"},
                  {name:"Digital Time", value:"digitalTime"}
                  
                ]}
          />  
        
         <Toggle settingsKey="transparent_hands" label="Transparent hour/minute hands" />  
        
        
     </Section>
      
        
       <Section title={<Text bold align="center">Donate!</Text>}>
      
      <Text italic>If you like this clockface and would like to see it further developed as well as other wonderful Fitbit apps and faces created, please know - I run on coffee. It's an essential fuel for inspiration and creativity. So feel free to donate by tapping the link below so I won't run out of fuel :) Thanks!
         </Text>
      
      <Link source="https://paypal.me/yuriygalanter">YURIY'S COFFEE FUND</Link> 
         
         </Section>   
      
      
    </Page>
    );
  }
}
registerSettingsPage(MySettings);
        